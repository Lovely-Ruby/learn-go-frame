package main

import (
	_ "back-end/internal/packed"

	"github.com/gogf/gf/v2/os/gctx"

	"back-end/internal/cmd"
)

func main() {
	cmd.Main.Run(gctx.GetInitCtx())
}
