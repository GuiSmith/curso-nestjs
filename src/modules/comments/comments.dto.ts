import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class CommentRequestDTO {
    @ApiProperty({ description: "Task's comment content "})
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    content: string
}

class CommentAuthorDTO {
    @ApiProperty() id: string
    @ApiProperty() name: string
    @ApiProperty() email: string
    @ApiProperty({ nullable: true }) avatar: string | null
}

export class CommentListItemDTO {
    @ApiProperty() id: string
    @ApiProperty() content: string
    @ApiProperty() taskId: string
    @ApiProperty() authorId: string
    @ApiProperty({ format: 'date-time'}) createdAt: Date
    @ApiProperty({ format: 'date-time'}) updatedAt: Date

    @ApiProperty({ type: CommentAuthorDTO }) author: CommentAuthorDTO
}

class CommentTaskDTO {
    @ApiProperty() id: string
    @ApiProperty() title: string
    @ApiProperty() projectId: string
}

export class CommentFullDTO extends CommentListItemDTO {
    @ApiProperty({ type: CommentTaskDTO })
    task: CommentTaskDTO
}
