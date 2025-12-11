import * as fs from 'fs';
import * as path from 'path';


export const deleteReportImageFile = (filename: string) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', '..', 'uploads', 'reports', filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
