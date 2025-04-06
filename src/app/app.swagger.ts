import { UserEntity } from './../apis/user/entities/user.entities';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ChangePasswordDto } from 'src/apis/auth/dto/change-password.dto';
import { LoginDto } from 'src/apis/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/apis/auth/dto/refresh-token.dto';

export function useSwagger(app: INestApplication) {
	const logger = new Logger('Swagger');
	const port = process.env.PORT || 3000;
	const path = 'docs';
	const config = new DocumentBuilder()
		.setTitle('NestJS Example')
		.setDescription('NestJS Example Documentation')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config, {
		extraModels
	});
	SwaggerModule.setup(path, app, document, {
		swaggerOptions: {
			tagsSorter: 'alpha',
			operationsSorter: (a, b) => {
				const methodsOrder = ['get', 'post', 'put', 'patch', 'delete', 'options', 'trace'];
				let result =
					methodsOrder.indexOf(a.get('method')) - methodsOrder.indexOf(b.get('method'));

				if (result === 0) {
					result = a.get('path').localeCompare(b.get('path'));
				}

				return result;
			}
		}
	});
	logger.log(`Your documentation is running on http://localhost:${port}/${path}`);
}

const extraModels = [UserEntity, LoginDto, RefreshTokenDto, ChangePasswordDto];
