import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CargaHoraria } from './CargaHoraria';

@Entity('professores')
export class Professor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    senha_hash: string;

    @OneToMany(() => CargaHoraria, carga => carga.professor)
    cargasHorarias: CargaHoraria[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
