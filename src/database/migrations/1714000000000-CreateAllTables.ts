import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllTables1714000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop na ordem correta (FK primeiro)
        await queryRunner.query(`DROP TABLE IF EXISTS cargas_horarias`);
        await queryRunner.query(`DROP TABLE IF EXISTS escolas`);
        await queryRunner.query(`DROP TABLE IF EXISTS professores`);

        await queryRunner.query(`
            CREATE TABLE professores (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                nome        VARCHAR(255) NOT NULL,
                email       VARCHAR(255) NOT NULL UNIQUE,
                senha_hash  VARCHAR(255) NOT NULL,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        await queryRunner.query(`
            CREATE TABLE escolas (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                nome        VARCHAR(255) NOT NULL UNIQUE,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        await queryRunner.query(`
            CREATE TABLE cargas_horarias (
                id               INT AUTO_INCREMENT PRIMARY KEY,
                periodosSemanais INT            NOT NULL,
                duracaoPeriodo   INT            NOT NULL,
                semanasTrim1     INT            NOT NULL,
                semanasTrim2     INT            NOT NULL,
                semanasTrim3     INT            NOT NULL,
                horasSemanal     DECIMAL(10,2)  NOT NULL,
                horasTrim1       DECIMAL(10,2)  NOT NULL,
                horasTrim2       DECIMAL(10,2)  NOT NULL,
                horasTrim3       DECIMAL(10,2)  NOT NULL,
                totalHoras       DECIMAL(10,2)  NOT NULL,
                professor_id     INT            NOT NULL,
                escola_id        INT            NOT NULL,
                created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE,
                FOREIGN KEY (escola_id)    REFERENCES escolas(id)     ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS cargas_horarias`);
        await queryRunner.query(`DROP TABLE IF EXISTS escolas`);
        await queryRunner.query(`DROP TABLE IF EXISTS professores`);
    }
}
