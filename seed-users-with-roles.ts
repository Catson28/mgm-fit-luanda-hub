// seed-users-with-roles.ts
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

// Password hash pré-gerado para todos os usuários
const PASSWORD_HASH = '$2a$10$9ZxyqFZHqY2r6CSjdk81tuegfpMtMlJOfVegqkWHCgwas1l8BZPwu';

// Roles que precisamos criar/verificar
const ROLES = [
  { name: 'saler', description: 'Sales representative' },
  { name: 'financer', description: 'Financial department' },
  { name: 'managerSaler', description: 'Sales manager' },
  { name: 'developer', description: 'System developer' },
  { name: 'hr', description: 'Human resources' },
  { name: 'inventory', description: 'Inventory Control' },
  { name: 'salerTyula', description: 'Atende e lida directamente com pacotes de Clientes' }, // Activa e desativa planos
  { name: 'adminTyula', description: 'Constroi ou elabora planos' }, // Constroi ou elabora planos
  { name: 'devTyula', description: 'Monitora e Garante permissoes avancadas a usuarios' }, // Monitora e Garante permissoes avancadas a usuarios
  { name: 'superAdminTyula', description: 'Supervisor de todos' } // Supervisor de todos
];

// Permissão que todos terão
const PERMISSION = {
  name: 'READ',
  type: 'READ',
  resource: 'all',
  description: 'Read permission for all resources'
};

// Gerar data aleatória nos últimos 30 dias para emailVerified
function getRandomVerifiedDate() {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
  return pastDate;
}

async function main() {
  console.log('Starting seed...');

  // 1. Verificar/Criar a permissão READ
  let readPermission = await prisma.permission.findUnique({
    where: { name: PERMISSION.name }
  });

  if (!readPermission) {
    readPermission = await prisma.permission.create({
      data: PERMISSION
    });
    console.log(`Permission ${PERMISSION.name} created`);
  }

  // 2. Verificar/Criar as roles e associar a permissão READ
  for (const roleData of ROLES) {
    let role = await prisma.role.findUnique({
      where: { name: roleData.name }
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: roleData.name,
          description: roleData.description
        }
      });
      console.log(`Role ${roleData.name} created`);
    }

    // Verificar se a role já tem a permissão READ
    const rolePermission = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId: readPermission.id
        }
      }
    });

    if (!rolePermission) {
      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: readPermission.id
        }
      });
      console.log(`Permission READ added to role ${roleData.name}`);
    }
  }

  // 3. Criar 5 usuários, cada um com uma role diferente
  for (let i = 0; i < ROLES.length; i++) {
    const roleName = ROLES[i].name;
    
    // Criar pessoa associada
    const person = await prisma.person.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        address: faker.location.streetAddress(),
        birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      }
    });

    // Gerar data de verificação de email
    const emailVerifiedDate = getRandomVerifiedDate();

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: `${person.firstName} ${person.lastName}`,
        email: person.email,
        password: PASSWORD_HASH,
        emailVerified: emailVerifiedDate,
        personId: person.id,
      }
    });

    // Obter a role correspondente
    const role = await prisma.role.findUnique({
      where: { name: roleName }
    });

    // Associar usuário à role
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id
      }
    });

    console.log(`User ${user.name} created with role ${roleName} (email verified on ${emailVerifiedDate.toISOString()})`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });