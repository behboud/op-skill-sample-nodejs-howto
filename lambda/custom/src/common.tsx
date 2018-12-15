import recipes from './receips'
import { RequestHandler, HandlerInput, ErrorHandler } from 'ask-sdk-core'
export const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(handlerInput: HandlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
        const items = Object.keys(recipes.RECIPE_EN_US)
        const item = requestAttributes.t(
            items[Math.floor(Math.random() * items.length)]
        )

        const speakOutput = requestAttributes.t(
            'WELCOME_MESSAGE',
            requestAttributes.t('SKILL_NAME'),
            item
        )
        const repromptOutput = requestAttributes.t('WELCOME_REPROMPT')

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse()
    },
}

export const HelpHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name ===
                'AMAZON.HelpIntent'
        )
    },
    handle(handlerInput: HandlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

        const items = Object.keys(recipes.RECIPE_EN_US)
        const item = requestAttributes.t(
            items[Math.floor(Math.random() * items.length)]
        )

        sessionAttributes.speakOutput = requestAttributes.t(
            'HELP_MESSAGE',
            item
        )
        sessionAttributes.repromptSpeech = requestAttributes.t(
            'HELP_REPROMPT',
            item
        )

        return handlerInput.responseBuilder
            .speak(sessionAttributes.speakOutput)
            .reprompt(sessionAttributes.repromptSpeech)
            .getResponse()
    },
}

export const SessionEndedRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return (
            handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
        )
    },
    handle(handlerInput: HandlerInput) {
        console.log(
            `Session ended with reason: ${JSON.stringify(
                handlerInput.requestEnvelope
            )}`
        )

        return handlerInput.responseBuilder.getResponse()
    },
}

export const RepeatHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name ===
                'AMAZON.RepeatIntent'
        )
    },
    handle(handlerInput: HandlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

        return handlerInput.responseBuilder
            .speak(sessionAttributes.speakOutput)
            .reprompt(sessionAttributes.repromptSpeech)
            .getResponse()
    },
}

export const ExitHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name ===
                'AMAZON.StopIntent' ||
                handlerInput.requestEnvelope.request.intent.name ===
                    'AMAZON.CancelIntent')
        )
    },
    handle(handlerInput: HandlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
        const speakOutput = requestAttributes.t(
            'STOP_MESSAGE',
            requestAttributes.t('SKILL_NAME')
        )

        return handlerInput.responseBuilder.speak(speakOutput).getResponse()
    },
}

export const DefaultErrorHandler: ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput: HandlerInput, error: Error) {
        console.log(`Error handled: ${error.message}`)

        return handlerInput.responseBuilder
            .speak("Sorry, I can't understand the command. Please say again.")
            .reprompt(
                "Sorry, I can't understand the command. Please say again."
            )
            .getResponse()
    },
}
