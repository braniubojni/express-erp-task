import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, length: 255, nullable: false })
    email: string

    @Column({ length: 255, nullable: false })
    password: string

    @Column({ length: 255, nullable: false })
    token: string
}