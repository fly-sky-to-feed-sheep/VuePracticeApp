new Vue({
    name: 'notebook',
    el:'#notebook',

    data(){
        return{
            content:'This is a note.',
        }
    },
    computed:{
        notePreview(){
            return marked.marked(this.content)
        },
    },
})