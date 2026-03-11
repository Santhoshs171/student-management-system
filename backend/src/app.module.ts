import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Student } from './students/student.entity';

@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Santhosh@171',
      database: 'studentsdb',
      entities: [Student],
      synchronize: true,
    }),

    StudentsModule

  ],
})
export class AppModule {}
