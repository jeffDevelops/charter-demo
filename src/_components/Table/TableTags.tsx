import React, { ReactText } from 'react'
import Tag from '../../_styled/Tag'

interface TableTagsProps {
  tags: ReactText[]
}

const TableTags = ({ tags }: TableTagsProps) => (
  <>
    {tags.map(tag => (
      <Tag key={tag}>{tag}</Tag>
    ))}
  </>
)

export default TableTags
