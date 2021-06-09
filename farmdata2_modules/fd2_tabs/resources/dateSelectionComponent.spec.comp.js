import { mount } from '@cypress/vue'
import DateSelectionComponent from "./dateSelectionComponent.js"

//import dayjs from "https://unpkg.com/dayjs@1.8.21/dayjs.min.js"
//import Meta from "vue-meta";
//Vue.use(Meta);
//import dayjs from 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.5/dayjs.min.js'

describe('Date Selection Component', () => {
    it('defaults to todays date', () =>{
        mount(DateSelectionComponent, {
            propsData: {
                defaultDate: "2021-06-09",
            }
        })

        cy.get('[data-cy=date-select]')
            .should('have.value', '2021-06-09')
    })
}) 