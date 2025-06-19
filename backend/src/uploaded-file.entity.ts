import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class UploadedFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  filename: string;

  @Column({ nullable: true })
  originalname: string;

  @CreateDateColumn()
  uploadedAt: Date;
}
