import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import app from './app';

if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET não está definido no arquivo .env. Abortando...');
    process.exit(1);
}

const PORT = Number(process.env.PORT) || 3333;

AppDataSource.initialize()
    .then(() => {
        console.log('✅ Banco de dados conectado com sucesso!');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    });
