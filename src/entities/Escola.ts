import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CargaHoraria } from './CargaHoraria';

@Entity('escolas')
export class Escola {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nome: string;

    @OneToMany(() => CargaHoraria, carga => carga.escola)
    cargasHorarias: CargaHoraria[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
