eventCompileStart = { msg ->
    def process = "grunt".execute()
    process.consumeProcessOutput(System.out, System.err)
    Thread shutdown = new Thread(
            new Runnable() {
                @Override
                void run () {
                    process.destroy()
                }
            }
    )

    Runtime.runtime.addShutdownHook(shutdown)

}

