import 'dotenv/config';

console.log('🔍 Verificando variáveis de ambiente...\n');

const requiredEnvVars = ['JWT_TOKEN_SECRET', 'JWT_REFRESH_TOKEN_SECRET', 'DATABASE_URL', 'PORT'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  A variável de ambiente "${key}" NÃO está definida.`);
  } else {
    console.log(`✅ ${key} carregado com sucesso.`);
  }
});

console.log('\n✅ Verificação concluída!');
