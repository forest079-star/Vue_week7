<template>
  <div class="modal fade" id="ArticleModal" tabindex="-1" aria-labelledby="articleModalLabel" aria-hidden="true"
    ref="modal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span v-if="isNew">新增文章</span>
            <span v-else>編輯文章</span>
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <!-- 基本資料區 -->
            <div class="row">
              <div class="col-sm-8">
                <div class="row mb-3">
                  <div class="col-sm-6">
                    <label class="form-label mt-2" for="articleTitle">文章標題</label>
                    <input v-model="tempArticle.title" type="text" class="form-control" id="articleTitle"
                      placeholder="請輸入文章標題">
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label mt-2" for="author">作者</label>
                    <input v-model="tempArticle.author" type="text" class="form-control" id="author"
                      placeholder="請輸入作者名稱">
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-sm-6">
                    <label class="form-label mt-2" for="createTime">創立日期</label>
                    <input v-model="create_at" type="date" class="form-control" id="createTime">
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label mt-2" for="endTime">預定下架日期</label>
                    <input v-model="due_date" type="date" class="form-control" id="endTime">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label mt-2" for="articleContent">文章簡述</label>
                  <textarea v-model="tempArticle.description" class="form-control" id="articleContent"></textarea>
                </div>
                <div class="row mb-3">
                  <div class="col">
                    <label class="form-label mt-2" for="articleTags">標籤</label>
                    <div class="row mb-3 g-1">
                      <div v-for="(tag, key) in tempArticle.tag" :key="key" class="col-md-2 mb-1">
                        <div class="input-group input-group-sm">
                          <input v-model="tempArticle.tag[key]" type="text" class="form-control" placeholder="請輸入標籤"
                            aria-label="Button" aria-describedby="">
                          <button class="btn btn-outline-danger" type="button" id=""
                            @click="tempArticle.tag.splice(key, 1)">X</button>
                        </div>
                      </div>
                      <div v-if="!tempArticle.tag.length || tempArticle.tag[tempArticle.tag.length - 1]"
                        class="col-sm-2 mb-1">
                        <button class="btn btn-outline-primary btn-sm" type="button" id=""
                          @click="tempArticle.tag.push('')">新增標籤</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <ckeditor :editor="editor" v-model="tempArticle.content" :config="editorConfig"></ckeditor>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input v-model="tempArticle.isPublic" class="form-check-input" type="checkbox" value=""
                      id="updateArticleCheck">
                    <label class="form-check-label" for="updateArticleCheck">
                      是否上架
                    </label>
                  </div>
                </div>
              </div>
              <!-- 圖片區 主圖(請輸入網址或上傳圖片)-->
              <div class="col-sm-4">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">主圖(請輸入網址或上傳圖片)
                    <div v-if="imgUploading" class="ms-2 spinner-border spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </label>
                  <input v-model="tempArticle.imageUrl" type="text" class="form-control" name="" id="imageUrl"
                    aria-describedby="helpId" placeholder="請輸入圖片連結">
                  <input class="form-control my-2" type="file" name="file-to-upload"
                    @change="(event) => uploadImage(event)" />
                  <img class="img-fluid rounded" :src="tempArticle.imageUrl" />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-gray" @click="$emit('cancel-article', 'edit')">取消</button>
          <button type="button" class="btn btn-outline-primary" @click="$emit('update-article')">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
// import Font from '@ckeditor/ckeditor5-font/src/font'
// import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
// import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
// import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
// import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
// import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
// import Heading from '@ckeditor/ckeditor5-heading/src/heading'
// import List from '@ckeditor/ckeditor5-list/src/list'
// import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter'
// import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
export default {
  props: {
    article: {
    },
    isNew: {
      type: Boolean,
      default: false
    },
    uploadImage: {
      type: Function,
      default: () => { }
    },
    imgUploading: {
      type: Boolean,
      default: false
    }
  },
  inject: ['$filters'],
  data () {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // plugins: [
        //   Heading,
        //   List,
        //   Font,
        //   EssentialsPlugin,
        //   BoldPlugin,
        //   ItalicPlugin,
        //   LinkPlugin,
        //   ParagraphPlugin,
        //   UploadAdapter,
        //   ImageResize
        // ],
        toolbar: []
        // toolbar: {
        //   items: ['heading', '|', 'undo', 'redo', 'bold', 'italic', '|', 'fontsize', 'fontColor', 'fontBackgroundColor', '|', 'numberedList', 'bulletedList', 'link', 'uploadImage']
        // }
        // image: {
        //   toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
        //   styles: ['full', 'alignLeft', 'alignRight']
        // },
        // ckfinder: {
        //   uploadUrl: 'https://vue3-course-api.hexschool.io/v2/api/ryanpro/admin/upload'
        // }
      },
      modal: '',
      tempArticle: {
        imagesUrl: [],
        tag: []
      },
      create_at: null,
      due_date: null
    }
  },
  emits: ['cancel-article', 'update-article'],
  mixins: [modalMixin],
  watch: {
    article () {
      this.tempArticle = this.article
      if (this.isNew) {
        this.create_at = new Date().getTime() / 1000
        this.due_date = null
      } else {
        this.create_at = this.dateTime(this.tempArticle.create_at)
        this.due_date = this.dateTime(this.tempArticle.due_date)
        console.log('this.tempArticle', this.tempArticle)
      }
    },
    due_date () {
      this.tempArticle.due_date = this.unixTime(this.due_date)
    },
    create_at () {
      this.tempArticle.create_at = this.unixTime(this.create_at)
    }
  },
  methods: {
    unixTime (time) {
      const localTime = Math.floor(new Date(time) / 1000)
      return localTime
    },
    dateTime (time) {
      if (isNaN(time) || typeof time !== 'number') {
        return ''
      }
      const localDate = new Date(time * 1000).toISOString().split('T')[0]
      return localDate
    }
  },
  mounted () {
    console.log('tempArticle', this.tempArticle)
  }
}
</script>
<style>
.ck-editor__editable_inline {
  min-height: 300px;
}

.ck-content {
  color: #000;
}</style>
