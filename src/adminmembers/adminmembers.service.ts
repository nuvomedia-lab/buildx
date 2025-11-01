import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../common/services/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberAccessDto } from './dto/update-member-access.dto';
import { GetMembersQueryDto } from './dto/get-members-query.dto';
import { ApprovalStatus, Role } from '@prisma/client';
import { ROLE_ACTIVITIES, getActivitiesForRole } from './activities.config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async sendInvitation(dto: InviteMemberDto) {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Check if phone number is already taken
      if (dto.phoneNumber) {
        const existingPhone = await this.prisma.user.findUnique({
          where: { phoneNumber: dto.phoneNumber },
        });

        if (existingPhone) {
          throw new ConflictException('User with this phone number already exists');
        }
      }

      // Generate invitation token
      const invitationToken = this.jwtService.sign(
        { email: dto.email },
        { expiresIn: '7d' },
      );

      // Validate activities against role permissions
      const allowedActivities = getActivitiesForRole(dto.role as Role);
      let finalActivities: string[] = [];

      if (dto.activities && dto.activities.length > 0) {
        // Check if "ALL" is in the activities array
        if (dto.activities.includes('ALL') || dto.activities.includes('All Access')) {
          finalActivities = ['ALL ACCESS'];
        } else {
          // Validate that all provided activities are allowed for this role
          const invalidActivities = dto.activities.filter(
            (activity) => !allowedActivities.includes(activity) && activity !== 'ALL',
          );

          if (invalidActivities.length > 0) {
            throw new BadRequestException(
              `The following activities are not allowed for role ${dto.role}: ${invalidActivities.join(', ')}`,
            );
          }

          finalActivities = dto.activities;
        }
      } else {
        // If no activities specified, default to all allowed activities for the role
        finalActivities = allowedActivities;
      }

      // Generate a temporary password - user will need to set their own
      const tempPassword = crypto.randomBytes(12).toString('hex');

      // Hash the temporary password
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Create the user with PENDING status
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          fullname: dto.fullname || 'New Member',
          role: dto.role as Role,
          activities: finalActivities,
          password: hashedPassword,
          status: ApprovalStatus.PENDING,
        },
      });

      // Send invitation email
      const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/create-password?token=${invitationToken}`;
      
      // Only send email if Zeptomail is configured
      if (process.env.ZEPTO_PASSWORD) {
        try {
          await this.mailer.sendTemplate({
            to: dto.email,
            templateId: process.env.ZEPTO_INVITE_TEMPLATE_ID || 'member-invitation',
            subject: 'Invitation to Join Build X',
            variables: {
              admin_name: dto.adminName || 'Your Admin',
              role: user.role,
              invite_url: inviteUrl,
              expiry_hours: '24 hours',
            },
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // User is created but email failed - don't throw, just log
          // In production, you might want to queue this for retry
        }
      } else {
        console.warn('Zeptomail not configured. Skipping email send.');
      }

      return {
        message: 'Invitation sent successfully',
        userId: user.id,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Failed to send invitation:', error);
      throw new BadRequestException(`Failed to send invitation: ${error.message || 'Unknown error'}`);
    }
  }

  async getAllRoles() {
    const roles = Object.values(Role).map((role) => ({
      role,
      displayName: this.getRoleDisplayName(role),
    }));

    return roles;
  }

  async getActivitiesForRole(roleParam: string) {
    // Validate role
    const validRole = Object.values(Role).find(
      (r) => r.toLowerCase() === roleParam.toLowerCase(),
    );

    if (!validRole) {
      throw new BadRequestException(`Invalid role: ${roleParam}`);
    }

    const activities = getActivitiesForRole(validRole);

    return activities.map((activity) => ({ activity }));
  }

  async getAllMembers(query: GetMembersQueryDto) {
    // Ensure page and limit are numbers (query params come as strings)
    const page = typeof query.page === 'string' ? parseInt(query.page, 10) : (query.page ?? 1);
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : (query.limit ?? 10);
    const search = query.search;
    const role = query.role;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Role filter
    if (role) {
      where.role = role;
    }

    // Search filter (name, email, or ID)
    if (search) {
      const searchNum = parseInt(search, 10);
      if (!isNaN(searchNum)) {
        // If search is a number, search by ID
        where.id = searchNum;
      } else {
        // Otherwise search by name or email
        where.OR = [
          { fullname: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    // Get total count
    const total = await this.prisma.user.count({ where });

    // Get paginated results
    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        activities: true,
        status: true,
        // isActive: true, // Will be available after Prisma client regeneration
        createdAt: true,
      } as any,
    });

    // Transform data
    const members = users.map((user: any) => {
      // Determine access type
      let accessType = 'Limited';
      if (user.activities.includes('ALL ACCESS')) {
        accessType = 'Full';
      } else {
        // Check if user has all activities for their role
        const allowedActivities = getActivitiesForRole(user.role);
        const hasAllActivities = allowedActivities.every((activity) =>
          user.activities.includes(activity),
        );
        if (hasAllActivities && user.activities.length === allowedActivities.length) {
          accessType = 'Full';
        }
      }

      // Projects - TODO: Update when Project model is added
      // For now, returning empty string
      const projects: string | null = null;

      return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        accessType,
        status: user.status,
        isActive: user.isActive,
        projects,
        createdAt: user.createdAt,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: members,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getMemberById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Member not found');
    }

    // Determine access type
    let accessType = 'Limited';
    if (user.activities.includes('ALL ACCESS')) {
      accessType = 'Full';
    } else {
      const allowedActivities = getActivitiesForRole(user.role);
      const hasAllActivities = allowedActivities.every((activity) =>
        user.activities.includes(activity),
      );
      if (hasAllActivities && user.activities.length === allowedActivities.length) {
        accessType = 'Full';
      }
    }

    // Check if member is fully onboarded (APPROVED status)
    const isFullyOnboarded = user.status === ApprovalStatus.APPROVED;

    // If fully onboarded, return extended response
    if (isFullyOnboarded) {
      // TODO: Query actual project data when Project model is added
      const completedProjects = 0; // TODO: Get from Project model where status = 'completed'
      const ongoingProjects = 0; // TODO: Get from Project model where status = 'ongoing'
      const totalProjects = completedProjects + ongoingProjects;

      const projects: any[] = []; // TODO: Populate from Project model

      return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        overview: {
          completedProjects,
          ongoingProjects,
          totalProjects,
          status: user.status,
          lastLogin: null, // TODO: Add login tracking to User model
          lastLogout: null, // TODO: Add logout tracking to User model
          isActive: (user as any).isActive,
        },
        projects,
        activities: user.activities,
        access: {
          role: user.role,
          accessType,
          activities: user.activities,
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }

    // For not fully onboarded members, return basic info
    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      role: user.role,
      activities: user.activities,
      accessType,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async withdrawInvitation(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Member not found');
    }

    // Only allow withdrawing invitations for PENDING users
    if (user.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Cannot withdraw invitation for members who have already joined');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'Invitation withdrawn successfully',
      email: user.email,
    };
  }

  async resendInvitation(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Member not found');
    }

    // Generate new invitation token
    const invitationToken = this.jwtService.sign({ email: user.email }, { expiresIn: '7d' });
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/complete-registration?token=${invitationToken}`;

    // Send invitation email
    await this.mailer.sendTemplate({
      to: user.email,
      templateId: process.env.ZEPTO_INVITE_TEMPLATE_ID || 'member-invitation',
      subject: 'Invitation to Join Build X',
      variables: {
        admin_name: 'Your Admin', // TODO: Get from JWT or context
        role: user.role,
        invite_url: inviteUrl,
        expiry_hours: '24 hours',
      },
    });

    return {
      message: 'Invitation resent successfully',
      email: user.email,
    };
  }

  async toggleMemberStatus(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Member not found');
    }

    // Toggle isActive status
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !(user as any).isActive } as any,
    }) as any;

    return {
      message: updatedUser.isActive ? 'Member reactivated successfully' : 'Member deactivated successfully',
      memberId: id,
      email: user.email,
      isActive: updatedUser.isActive,
    };
  }

  async updateMemberAccess(id: number, dto: UpdateMemberAccessDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Member not found');
    }

    const updateData: any = {};

    // Update role if provided
    if (dto.role) {
      updateData.role = dto.role;
      
      // If activities are provided, validate them against the new role
      if (dto.activities && dto.activities.length > 0) {
        const allowedActivities = getActivitiesForRole(dto.role);
        const invalidActivities = dto.activities.filter(
          (activity) => !allowedActivities.includes(activity) && activity !== 'ALL',
        );

        if (invalidActivities.length > 0) {
          throw new BadRequestException(
            `The following activities are not allowed for role ${dto.role}: ${invalidActivities.join(', ')}`,
          );
        }

        updateData.activities = dto.activities.includes('ALL') || dto.activities.includes('All Access')
          ? ['ALL ACCESS']
          : dto.activities;
      } else {
        // If no activities specified and role changed, default to all allowed activities
        updateData.activities = getActivitiesForRole(dto.role);
      }
    } else if (dto.activities) {
      // Update activities for existing role
      const allowedActivities = getActivitiesForRole(user.role);
      const invalidActivities = dto.activities.filter(
        (activity) => !allowedActivities.includes(activity) && activity !== 'ALL',
      );

      if (invalidActivities.length > 0) {
        throw new BadRequestException(
          `The following activities are not allowed for role ${user.role}: ${invalidActivities.join(', ')}`,
        );
      }

      updateData.activities = dto.activities.includes('ALL') || dto.activities.includes('All Access')
        ? ['ALL ACCESS']
        : dto.activities;
    }

    await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return {
      message: 'Member access updated successfully',
      memberId: id,
      email: user.email,
    };
  }

  async resetMemberPassword(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Member not found');
    }

    // Generate OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store OTP
    await this.prisma.passwordReset.create({
      data: {
        email: user.email,
        otpHash,
        expiresAt,
        attempts: 0,
      },
    });

    // Send password reset email
    await this.mailer.sendTemplate({
      to: user.email,
      templateId: process.env.ZEPTO_FORGOT_TEMPLATE_ID || 'forgot-password',
      subject: 'Password Reset Request',
      variables: {
        fullname: user.fullname,
        otp,
      },
    });

    return {
      message: 'Password reset email sent successfully',
      email: user.email,
    };
  }

  private getRoleDisplayName(role: Role): string {
    const displayNames: Record<Role, string> = {
      PM: 'Project Manager',
      QS: 'Quantity Surveyor',
      SEF: 'Site Engineer/Foreman',
      SK: 'Store Keeper',
      PROC: 'Procurement',
      ACC: 'Accountant',
      AD: 'Admin',
    };

    return displayNames[role];
  }
}

