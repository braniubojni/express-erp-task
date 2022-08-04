export class UserController {
  public static async signup(req: Request, res: Response): Promise<void> {
    try {
      // @ts-ignore
      res.json([{ name: 'test' }]);
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
