import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { Role } from "src/roles/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { RoleEnum } from "src/roles/constants/role.enum";
import { StatusEnum } from "src/users/constants/status.enum";

export class UserAdminSeeder {
  constructor(
    private dataSource: DataSource,
    private readonly config: ConfigService
  ) {}

  async seed() {
    const roleRepo = this.dataSource.getRepository(Role);
    const userRepo = this.dataSource.getRepository(User);

    const adminRole = await roleRepo.findOne({ where: { name: RoleEnum.ADMIN } });
    if (!adminRole) throw new Error("Internal server error");

    const fullname = this.config.get<string>("DEFAULT_FULLNAME") || "admin";
    const email = this.config.get<string>("DEFAULT_EMAIL") || "admin@gmail.com";
    // const phone = this.config.get<string>("DEFAULT_PHONE") || "089890903";
    const password = this.config.get<string>("DEFAULT_ADMIN_PASSWORD") || "Strong!#ButNOTdEfaulTPassword:D";
    const hashPassword = await bcrypt.hash(password, 10);

    const defaultAdmin = userRepo.create({
      fullname,
      email,
      password: hashPassword,
      isVerifyEmail: true,
      role: adminRole,
    });

    const existingAdmin = await userRepo.findOne({ where: { email } });

    if (!existingAdmin) {
      const admin = await userRepo.save(defaultAdmin);

      // const defaultProfile = profileRepo.create({
      //   user: admin, // IMPORTANT: pass full entity
      //   fullname,
      //   phone,
      //   bio: "N/A",
      //   currentJob: "ADMIN",
      //   status: StatusEnum.APPROVED,
      // });
      // const a = await profileRepo.save(defaultProfile);
      console.log("Default admin created");
    } else {
      console.log("Default admin already exists");
    }
  }
}
