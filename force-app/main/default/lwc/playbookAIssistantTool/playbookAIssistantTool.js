import { LightningElement} from 'lwc';
import sendRequest from '@salesforce/apex/N8nHttpClient.sendRequest';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class PlaybookAIssistantTool extends LightningElement {

    prompt = '';
    response = '';
    isLoading = false;

    handlePromptChange(event) {
        this.prompt = event.target.value;
    }

     async handleClick() {
        if (!this.prompt?.trim()) {
            this.showToast('Atenção ⚠', 'Por favor, insira uma pergunta antes de enviar.', 'warning');
            return;
        }

        this.isLoading = true;
        this.response = '';

        try {
            const result = await sendRequest({ prompt: this.prompt });
            
            const parsedResult = this.parseResponse(result);
            this.response = parsedResult;

        } catch (error) {
            this.handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    parseResponse(result) {
        try {
            const parsed = JSON.parse(result);
            
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.agentAnswer) {
                return parsed[0].agentAnswer;
            }
            
            return result;
        } catch (parseError) {
            return result;
        }
    }

    handleError(error) {
        console.error('Error sending request:', error);
        
        const errorMessage = error?.body?.message || error?.message || 'Erro desconhecido ao processar requisição.';
        this.response = `Erro: ${errorMessage}`;
        
        this.showToast('Erro', 'Ocorreu um erro ao processar sua solicitação.', 'error');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}