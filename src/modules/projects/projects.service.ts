import { Injectable } from '@nestjs/common'

@Injectable()
export class ProjectsService {
  findAll() {
    return ['teste1', 'teste2']
  }

  findById(id: string) {
    return 'teste1'
  }

  create(data: any) {
    return 'create teste1'
  }

  update(id: string, data: any) {
    return 'update teste1'
  }

  remove(id: string) {
    return 'remove teste1'
  }
}
