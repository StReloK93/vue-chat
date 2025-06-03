import { type Ref, ref } from "vue"

export default function () {
   const dropzoneRef = ref<HTMLElement | null>(null)
   const isHovering = ref(false)
   const bufferFiles: any = ref([])

   function onDragOver(event: DragEvent) {
      if (!dropzoneRef.value) return
      const rect = dropzoneRef.value.getBoundingClientRect()
      const x = event.clientX
      const y = event.clientY

      const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

      isHovering.value = inside
   }


   const onPaste = async (event: ClipboardEvent) => {
      bufferFiles.value = []
      const items: any = event.clipboardData?.items || []

      for (const item of items) {

         if (item.type.startsWith('image')) {
            const file = item.getAsFile()
            if (file) {
               const reader = new FileReader()
               reader.onload = (e) => {
                  bufferFiles.value.push(e.target?.result)
               }
               reader.readAsDataURL(file)
            }
         }
      }
   }

   const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const files: any = event.dataTransfer?.files || []

      for (const file of files) {

         if (file.type.startsWith('image')) {
            if (file) {
               const reader = new FileReader()
               reader.onload = (e) => {
                  bufferFiles.value.push(e.target?.result)
               }
               reader.readAsDataURL(file)
            }
         }
      }

      isHovering.value = false
   };

   return {handleDrop, onPaste, onDragOver, bufferFiles, isHovering, dropzoneRef}
}