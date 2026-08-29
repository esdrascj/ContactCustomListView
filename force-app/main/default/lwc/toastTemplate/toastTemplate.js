import { LightningElement } from 'lwc'; 

import Toast from 'lightning/toast'; 

  

export default class ToastThemes extends LightningElement { 

    label = 'Toast Notification'; 

    message = 'This is the toast message'; 

    variant = 'info'; 

    mode = 'dismissible'; 

  

    get variantOptions() { 

        return [ 

            { label: 'Info (grey)', value: 'info' }, 

            { label: 'Success (green)', value: 'success' }, 

            { label: 'Warning (orange)', value: 'warning' }, 

            { label: 'Error (red)', value: 'error' }, 

        ]; 

    } 

  

    get modeOptions() { 

        return [ 

            { label: 'Dismissible', value: 'dismissible' }, 

            { label: 'Sticky', value: 'sticky' }, 

        ]; 

    } 

  

    handleLabelChange(event) { 

        this.label = event.target.value; 

    } 

  

    handleMessageChange(event) { 

        this.message = event.target.value; 

    } 

  

    handleVariantChange(event) { 

        this.variant = event.detail.value; 

    } 

  

    handleModeChange(event) { 

        this.mode = event.detail.value; 

    } 

  

    handleShowToast() { 

        Toast.show( 

            { 

                label: this.label, 

                message: this.message, 

                variant: this.variant, 

                mode: this.mode, 

            }, 

            this, 

        ); 

    } 

} 