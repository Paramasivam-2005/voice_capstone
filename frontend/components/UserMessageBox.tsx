import React from 'react'

export default function UserMessageBox({child_text}:{child_text:string}) {
  return (
    <div className='h-10 bg-blue-200 w-[200px] text-black'>
      {child_text}
    </div>
  )
}
