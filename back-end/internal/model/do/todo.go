// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// Todo is the golang structure of table todo for DAO operations like Where/Data.
type Todo struct {
	g.Meta    `orm:"table:todo, do:true"`
	Id        any         //
	Title     any         //
	Done      any         //
	CreatedAt *gtime.Time //
	UpdatedAt *gtime.Time //
}
