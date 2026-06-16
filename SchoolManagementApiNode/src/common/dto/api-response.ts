import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class ApiResult<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  value: T | null;

  static success<T>(value: T, message = 'Operación exitosa', statusCode = 200): ApiResult<T> {
    return { isSuccess: true, message, statusCode, value };
  }

  static successEmpty(message = 'Operación exitosa', statusCode = 200): ApiResult<null> {
    return { isSuccess: true, message, statusCode, value: null };
  }

  static failure(message: string, statusCode = 400): ApiResult<null> {
    return { isSuccess: false, message, statusCode, value: null };
  }
}

export class ApiResultDto {
  @ApiProperty({ example: true })
  isSuccess: boolean;

  @ApiProperty({ example: 'Operación exitosa' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ nullable: true })
  value: any;
}

export function ApiResultResponse(model: Type<any>) {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResultDto) },
          {
            properties: {
              value: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
}
