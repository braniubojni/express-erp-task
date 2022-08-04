import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { User } from "./user-entity"

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, length: 255, nullable: false })
		refresh_token: string

    @OneToOne(type => User, user => user.token)
    @JoinColumn()
    user: User
    
}