import { Injectable } from '@nestjs/common'
import { ProjectRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  findAll() {
    return ['teste1', 'teste2']
  }

  findById(id: string) {
    return 'teste1'
  }

  create(data: ProjectRequestDTO) {
    return 'create teste1'
  }

  update(id: string, data: ProjectRequestDTO) {
    return 'update teste1'
  }

  remove(id: string) {
    return 'remove teste1'
  }
}
