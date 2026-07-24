import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { CollaboratorsService } from './collaborators.service'

describe('CollaboratorsService', () => {
  let service: CollaboratorsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaboratorsService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<CollaboratorsService>(CollaboratorsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
