import { SkillBuilders } from 'ask-sdk-core'
import {
    DefaultErrorHandler,
    ExitHandler,
    LaunchRequestHandler,
    HelpHandler,
    RepeatHandler,
    SessionEndedRequestHandler,
} from './common'
import { LocalizationInterceptor } from './languagestring'
import { RecipeHandler } from './intents'

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RecipeHandler,
        HelpHandler,
        RepeatHandler,
        ExitHandler,
        SessionEndedRequestHandler
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(DefaultErrorHandler)
    .lambda()
