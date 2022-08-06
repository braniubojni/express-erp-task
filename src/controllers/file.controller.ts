import { NextFunction, Request, Response } from 'express';
import { FileService } from '../services/file.service';

export class FileController {
  public static async fileUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await FileService.fileUpload(req);
      res.status(201).send({
        message: 'File uploaded successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  public static async fileList(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { list_size = 10, page = 1 } = req.query;
      const files = await FileService.fileList(+list_size, +page);
      res.status(200).send(files);
    } catch (error) {
      next(error);
    }
  }

  public static async fileDelete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const removedFile = await FileService.removeFile(+id);

      res.status(202).send(removedFile);
    } catch (error) {
      next(error);
    }
  }

  public static async getFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const file = await FileService.findById(+id);

      res.status(200).send(file);
    } catch (error) {
      next(error);
    }
  }

  public static async downloadFile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const file = await FileService.downloadFile(+id);

    res.download(file);
  }
}
