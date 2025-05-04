"use client";
import { useCurrentUser } from "@/services/hooks/use-current-user";
import { FormError } from "@/components/form-error";

// Permission types
type PermissionType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';

// The actual User type from useCurrentUser() seems to have this structure

/*
type CurrentUser = {
  id: string;
  email: string;
  name: string | null;  // This is probably nullable in the actual user object
  roles?: {
    role: {
      name: string;
      permissions: {
        name: string;
        resource: string;
      }[];
    };
  }[];
};
*/

// For your permission checking function
type Permission = {
  id: string;
  name: string;
  type: PermissionType;
  resource: string;
};

type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

type User = {
  id: string;
  email: string;
  name: string;
  roles: Role[];
};

interface PermissionGateProps {
  children: React.ReactNode;
  alternativeContent?: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  resource?: string;
  requireAll?: boolean;
}

export const PermissionGate = ({
  children,
  alternativeContent,
  allowedRoles = [],
  requiredPermissions = [],
  resource,
  requireAll = false,
}: PermissionGateProps) => {
  const { user } = useCurrentUser();

  // Authentication check
  if (!user) {
    return alternativeContent ?? <FormError message="You must be logged in to view this content!" />;
  }

  // Check for NGAPA role first - if present, grant all access
  const hasNGAPARole = user.roles?.some(role => role.role.name === 'NGAPA');
  if (hasNGAPARole) {
    return <>{children}</>;
  }

  // Role check
  const hasAllowedRole = allowedRoles.length === 0 || user.roles?.some(
    role => allowedRoles.includes(role.role.name)
  );

  // Convert CurrentUser to User format for permission checking
  const formattedUser: User = {
    id: user.id,
    email: user.email,
    name: user.name ?? "", // Handle potential null with default empty string
    roles: (user.roles ?? []).map(roleObj => ({
      id: "", // We don't have this in CurrentUser but need it in User
      name: roleObj.role.name,
      permissions: roleObj.role.permissions.map(p => ({
        id: "",  // We don't have this in CurrentUser but need it in User
        name: p.name,
        // Map permission name to proper type or use a fallback if it doesn't match
        type: isValidPermissionType(p.name) ? p.name as PermissionType : 'READ',
        resource: p.resource
      }))
    }))
  };

  // Permission check
  const hasRequiredPermissions = checkPermissions(
    formattedUser,
    requiredPermissions,
    resource,
    requireAll
  );

  if (!hasAllowedRole || !hasRequiredPermissions) {
    return alternativeContent ?? null;
  }

  return <>{children}</>;
};

// Type guard to check if a string is a valid PermissionType
function isValidPermissionType(type: string): type is PermissionType {
  return ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'].includes(type as string);
}

// Helper function to check permissions
function checkPermissions(
  user: User,
  requiredPermissions: string[],
  resource?: string,
  requireAll = false
): boolean {
  if (requiredPermissions.length === 0) return true;

  const userPermissions = user.roles.flatMap(role =>
    role.permissions.map(permission => ({
      name: permission.name,
      resource: permission.resource
    }))
  );

  // Check if user has MANAGE permission for the resource
  const hasManagePermission = userPermissions.some(
    permission =>
      permission.name === 'MANAGE' &&
      (!resource || permission.resource === resource)
  );

  if (hasManagePermission) return true;

  return requireAll
    ? requiredPermissions.every(permission =>
      userPermissions.some(p =>
        p.name === permission &&
        (!resource || p.resource === resource)
      )
    )
    : requiredPermissions.some(permission =>
      userPermissions.some(p =>
        p.name === permission &&
        (!resource || p.resource === resource)
      )
    );
}