import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Criar departamentos e cargos (se não existirem)
  const department = await prisma.department.upsert({
    where: { name: 'TI' },
    update: {},
    create: {
      name: 'TI',
      description: 'Departamento de Tecnologia da Informação',
    },
  });

  const position = await prisma.position.upsert({
    where: { title: 'Desenvolvedor' },
    update: {},
    create: {
      title: 'Desenvolvedor',
      description: 'Desenvolvedor de Software',
    },
  });

  console.log(`Departamento criado: ${department.name}`);
  console.log(`Cargo criado: ${position.title}`);

  // Adicionar 20 funcionários
  for (let i = 1; i <= 20; i++) {
    // Criar uma pessoa associada ao funcionário
    const person = await prisma.person.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      },
    });

    // Criar o funcionário
    const employee = await prisma.employee.create({
      data: {
        hireDate: faker.date.past(),
        baseSalary: faker.number.float({ min: 3000, max: 10000, precision: 2 }),
        status: 'ACTIVE',
        positionId: position.id,
        departmentId: department.id,
        personId: person.id,
      },
    });

    console.log(`Funcionário criado: ${person.firstName} ${person.lastName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });