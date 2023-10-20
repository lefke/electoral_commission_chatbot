import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const question = req.body.question;
      const filePath = path.join(process.cwd(), 'user_questions.csv');
      fs.appendFileSync(filePath, `${question}\n`);
      res.status(200).json({ message: 'Question appended successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};