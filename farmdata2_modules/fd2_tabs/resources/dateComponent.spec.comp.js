import { mount } from '@cypress/vue'
import datePicker from './dateComponent.js'
//import dayjs from "https://unpkg.com/dayjs@1.8.21/dayjs.min.js"
import Meta from "vue-meta";
Vue.use(Meta);
//import dayjs from 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.5/dayjs.min.js'

decribe('datePickerComponent', () => {
    it('Default Date', () =>{
        mount(datePicker, {
        })

        cy.get('date-cy=date-select')
            .should('have.value', '2021-6-8')
    })
})