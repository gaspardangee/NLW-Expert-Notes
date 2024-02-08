import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCreatedProps{
    onNoteCreated: (content: string) => void
  }

  let speechRecognition: SpeechRecognition | null = null

export default function NewNoteCard({onNoteCreated}: NewNoteCreatedProps){

    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState("")
    const [isRecording, setIsRecording] = useState(false)

    function handleStartEditor(){
        setShouldShowOnboarding(!shouldShowOnboarding)
    }

    function handleContentChanged(event: ChangeEvent <HTMLTextAreaElement>){
        setContent(event.target.value)

        if(event.target.value == ""){
            setShouldShowOnboarding(!shouldShowOnboarding)
        }
    }

    function handleSaveNote(event: FormEvent){

        if (content == '') {
            return
        }
        event.preventDefault()
        //console.log(content)
        onNoteCreated(content)
        setContent('')
        setShouldShowOnboarding(true)
        toast.success("Nota Criada com sucesso!")

    }


        function handleStopRecording(){
            setIsRecording(false)
        }

        function handleStartRecording(){

            setIsRecording(true)
            if (speechRecognition !== null) {
                speechRecognition.stop()
            }

        const isSpeechRecognitionAPIAvailable = "speechRecognition" in window
        || 'webkitSpeechRecognition' in window

        if (!isSpeechRecognitionAPIAvailable) {
            alert("Infelizmente o seu navegador não suporta a API de gravação!")
            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)
        
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) =>{
            console.log(event.results)
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, "")
            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.log(event)
        }

        speechRecognition.start()
    }
    return(
        <Dialog.Root>
                        
            <Dialog.Trigger className="flex flex-col text-left rounded-md bg-slate-700 p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">

                <span className="text-sm font-medium text-slate-200">
                Adicionar Nota
                </span>

                <p className="text-sm leading-6 ">
                Grave uma nota em Áudio que será convertida em texto automaticamente
                </p>

            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/60' />
                <Dialog.Content className='overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
                    
                    <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                        <X className="size-5" />
                    </Dialog.Close>
                    
                    <form onSubmit={handleSaveNote} className="flex flex-1 flex-col">
                        <div className="flex flex-1 flex-col gap-3 p-5">

                        <span className="text-sm font-medium text-slate-300">
                            Adicionar Nota
                        </span>
                        {shouldShowOnboarding ?(
                            <p className="text-sm leading-6 ">
                                Comece <button type="button" className="font-medium text-lime-400 hover:underline" onClick={handleStartRecording}>gravando uma nota</button> em áudio, ou se preferir <button className="font-medium text-lime-400 hover:underline" onClick={handleStartEditor}>utilize apenas texto</button>.
                            </p>
                        ):(
                            <textarea
                                autoFocus
                                className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                                onChange={handleContentChanged}
                                value={content}
                                />
                        )}

                        </div>

                        {
                            isRecording ?(

                                <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                                onClick={handleStopRecording}
                                >
                                    <div className="size-3 rounded-full bg-red-500 animate-pulse"></div>
                                    Gravando! Clique para interromper!
                                </button>
                            )
                            :(

                                <button
                                type="button"
                                onClick={handleSaveNote}
                                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                                >
                                    Salvar nota
                                </button>
                            )
                        }
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}