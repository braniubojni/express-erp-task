import { UserDto } from '../common/dtos/user.dto';
import { ExpressReturnType, IUserController } from '../common/interfaces';
import { UserService } from '../services/user.service';

export class UserController {
  public static async signup(
    req: { body: { id: string; password: string } },
    res: ExpressReturnType
  ) {
    try {
      const { id, password } = req.body;
      const userData = await UserService.signup(id, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      res.status(200).json({
        ...userData
      });
    } catch (error) {}
  }

  public static async signin(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
  public static async signinNewToken(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
  public static async logout(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
}
