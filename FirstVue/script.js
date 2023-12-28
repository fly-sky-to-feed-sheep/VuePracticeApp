new Vue({
    name: 'notebook',
    el:'#notebook',

    data(){
        return{
            content: localStorage.getItem('content')||'fake typora',
            notes:[],
            selectedId: null,
        }
    },
    computed:{
        notePreview(){
            return this.selectedNote ? marked.marked(this.selectedNote.content) : ' '
        },
        selectedNote()
        {
            return this.notes.find(note => note.id === this.selectedId) || { content: '' };
        },
    },
    watch:{
        content:{
            handler: 'saveNote',
        },
    },
    methods:{
        saveNote(val){
            console.log('saving note:',val)
            localStorage.setItem('content',val)
            this.reportOperation('saving')
        },
        reportOperation(opName){
            console.log('The',opName,'operation was completed')
        },
        addNote(){
            const time = Date.now()
            const note = {
                id: String(time),
                title:'New note ' + (this.notes.length +1),
                content: '**Hi** This notebook is using [markdown](https://github.com/markedjs/marked) for formatting',
                created: time,
                favorite: false,
            }
            this.notes.push(note)
        },
        selectNote(note) {
            this.selectedId = note.id;
        },
    },

    mounted(){
        console.log('restore note:',localStorage.getItem('content'))
    }
})