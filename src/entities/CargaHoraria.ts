import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Professor } from './Professor';
import { Escola } from './Escola';

@Entity('cargas_horarias')
export class CargaHoraria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    periodosSemanais: number;

    @Column()
    duracaoPeriodo: number;

    @Column()
    semanasTrim1: number;

    @Column()
    semanasTrim2: number;

    @Column()
    semanasTrim3: number;

    @Column('decimal', { precision: 10, scale: 2 })
    horasSemanal: number;

    @Column('decimal', { precision: 10, scale: 2 })
    horasTrim1: number;

    @Column('decimal', { precision: 10, scale: 2 })
    horasTrim2: number;

    @Column('decimal', { precision: 10, scale: 2 })
    horasTrim3: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalHoras: number;

    @ManyToOne(() => Professor, professor => professor.cargasHorarias)
    @JoinColumn({ name: 'professor_id' })
    professor: Professor;

    @Column()
    professor_id: number;

    @ManyToOne(() => Escola, escola => escola.cargasHorarias)
    @JoinColumn({ name: 'escola_id' })
    escola: Escola;

    @Column()
    escola_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
