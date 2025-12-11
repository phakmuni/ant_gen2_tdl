import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
// import { Role } from "src/role/entity/role.entity"; // Not needed here

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector : Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY, [
                context.getHandler(), // method level metadata
                context.getClass()    // class level metadata
            ]
        );
        if(!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();
        if(!user) throw new ForbiddenException("User are not authenticated.");
        if (!user.role || !user.role.name) {
            throw new ForbiddenException("Role information is missing or not loaded.");
        }
        const userRoleName = user.role.name; 
        const hasRequiredRole = requiredRoles.includes(userRoleName);
        if(!hasRequiredRole) throw new ForbiddenException("Not allowed to access this route.");
        return true;
    }
}