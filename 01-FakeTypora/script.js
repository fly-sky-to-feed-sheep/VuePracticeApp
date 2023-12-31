new Vue({
    name: 'notebook',
    el:'#notebook',

    data(){
        return{
            notes:JSON.parse(localStorage.getItem('notes'))|| [],
            selectedId: localStorage.getItem('selected-id') || null,
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
        sortedNotes(){
            return this.notes.slice()
                .sort((a,b) => a.created -b.created)
                .sort((a,b) => (a.favorite === b.favorite) ? 0
                    : a.favorite ? -1
                    : 1)
        },
        formattedCreatedDate() {
            if (this.selectedNote && this.selectedNote.created) {
                return moment(this.selectedNote.created).format('YYYY-MM-DD HH:mm:ss');
            }
            return '';
        },
        linesCount(){
            if (this.selectedNote){
                return this.selectedNote.content.split(/\r\n|\r|\n/).length
            }
        },
        wordsCount(){
            if(this.selectedNote){
                var s = this.selectedNote.content
                s = s.replace(/\n/g, ' ')
                s = s.replace(/(^\s*)|(\s*$)/gi, '')
                s = s.replace(/\s\s+/gi, ' ')
                return s.split(' ').length
            }
        },
        charatersCount(){
            if(this.selectedNote){
                return this.selectedNote.content.split('').length
            }
        },
    },
    watch:{
        content:{
            handler: 'saveNote',
            deep: true,
        },
        notes: 'saveNotes',
        selectedId(val){
            localStorage.setItem('selected-id',val)
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
        saveNotes(){
            localStorage.setItem('notes', JSON.stringify(this.notes))
            console.log('Notes saved!', new Date())
        },
        updateNoteContent(newContent) {
            const selectedNote = this.notes.find(note => note.id === this.selectedId);
            if (selectedNote) {
                selectedNote.content = newContent;
                this.saveNotes();
            }
        },
        removeNote(){
            if(this.selectedNote && confirm(' Delete the note? '))
            {
                const index = this.notes.indexOf(this.selectedNote)
                if (index !== -1){
                    this.notes.splice(index,1)
                }
            }
        },
        favoriteNote() {
            const selectedNote = this.notes.find(note => note.id === this.selectedId);
            if (selectedNote) {
                selectedNote.favorite = !selectedNote.favorite;
                this.saveNotes();
            }
        },
    },

    mounted(){
        console.log('restore note:',localStorage.getItem('content'))
    }
})