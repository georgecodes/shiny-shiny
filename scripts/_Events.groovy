eventCompileStart = { msg ->
    def process = "grunt".execute()
    process.consumeProcessOutput(System.out, System.err)
}

