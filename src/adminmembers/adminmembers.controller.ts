import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminMembersService } from './adminmembers.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberAccessDto } from './dto/update-member-access.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { RoleResponseDto, ActivityResponseDto } from './dto/role-response.dto';
import { GetMembersQueryDto } from './dto/get-members-query.dto';
import { PaginatedMembersResponseDto, MemberResponseDto } from './dto/member-response.dto';
import { MemberDetailResponseDto } from './dto/member-detail-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('adminmembers')
@ApiBearerAuth('JWT-auth')
@Controller('adminmembers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.AD)
export class AdminMembersController {
  constructor(private readonly adminMembersService: AdminMembersService) {}

  @Post('invite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send invitation to a new member' })
  @ApiResponse({ status: 200, description: 'Invitation sent successfully', type: BaseResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  @ApiResponse({ status: 409, description: 'User already exists', type: BaseResponseDto })
  async inviteMember(@Body() dto: InviteMemberDto) {
    try {
      const result = await this.adminMembersService.sendInvitation(dto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all available roles' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully', type: RoleResponseDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  async getAllRoles() {
    try {
      return await this.adminMembersService.getAllRoles();
    } catch (error) {
      throw error;
    }
  }

  @Get('roles/:role/activities')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get allowed activities for a specific role' })
  @ApiResponse({ status: 200, description: 'Activities retrieved successfully', type: ActivityResponseDto, isArray: true })
  @ApiResponse({ status: 400, description: 'Invalid role', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  async getRoleActivities(@Param('role') role: string) {
    try {
      return await this.adminMembersService.getActivitiesForRole(role);
    } catch (error) {
      throw error;
    }
  }

  @Get('members')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all members with pagination, search and filter' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully', type: PaginatedMembersResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  async getAllMembers(@Query() query: GetMembersQueryDto) {
    try {
      return await this.adminMembersService.getAllMembers(query);
    } catch (error) {
      throw error;
    }
  }

  @Get('members/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get member details by ID' })
  @ApiResponse({ status: 200, description: 'Member retrieved successfully', type: MemberDetailResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  @ApiResponse({ status: 404, description: 'Member not found', type: BaseResponseDto })
  async getMemberById(@Param('id') id: string) {
    try {
      return await this.adminMembersService.getMemberById(parseInt(id, 10));
    } catch (error) {
      throw error;
    }
  }

  @Delete('members/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw invitation (delete pending member)' })
  @ApiResponse({ status: 200, description: 'Invitation withdrawn successfully', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  @ApiResponse({ status: 404, description: 'Member not found', type: BaseResponseDto })
  @ApiResponse({ status: 400, description: 'Cannot withdraw invitation for approved members', type: BaseResponseDto })
  async withdrawInvitation(@Param('id') id: string) {
    try {
      return await this.adminMembersService.withdrawInvitation(parseInt(id, 10));
    } catch (error) {
      throw error;
    }
  }

  @Post('members/:id/resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend invitation email' })
  @ApiResponse({ status: 200, description: 'Invitation resent successfully', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  @ApiResponse({ status: 404, description: 'Member not found', type: BaseResponseDto })
  async resendInvitation(@Param('id') id: string) {
    try {
      return await this.adminMembersService.resendInvitation(parseInt(id, 10));
    } catch (error) {
      throw error;
    }
  }

  @Put('members/:id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate or reactivate a member' })
  @ApiResponse({ status: 200, description: 'Member status updated successfully', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  @ApiResponse({ status: 404, description: 'Member not found', type: BaseResponseDto })
  async toggleMemberStatus(@Param('id') id: string) {
    try {
      return await this.adminMembersService.toggleMemberStatus(parseInt(id, 10));
    } catch (error) {
      throw error;
    }
  }

  @Put('members/:id/access')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update member access (role and activities)' })
  @ApiResponse({ status: 200, description: 'Member access updated successfully', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  @ApiResponse({ status: 404, description: 'Member not found', type: BaseResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid access permissions', type: BaseResponseDto })
  async updateMemberAccess(@Param('id') id: string, @Body() dto: UpdateMemberAccessDto) {
    try {
      return await this.adminMembersService.updateMemberAccess(parseInt(id, 10), dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('members/:id/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset member password (sends reset email)' })
  @ApiResponse({ status: 200, description: 'Password reset email sent successfully', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token', type: BaseResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required', type: BaseResponseDto })
  @ApiResponse({ status: 404, description: 'Member not found', type: BaseResponseDto })
  async resetMemberPassword(@Param('id') id: string) {
    try {
      return await this.adminMembersService.resetMemberPassword(parseInt(id, 10));
    } catch (error) {
      throw error;
    }
  }
}

