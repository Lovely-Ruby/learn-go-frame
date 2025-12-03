// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// Todo is the golang structure for table todo.
type Todo struct {
	Id        int         `json:"id"        orm:"id"         description:""` //
	Title     string      `json:"title"     orm:"title"      description:""` //
	Done      int         `json:"done"      orm:"done"       description:""` //
	CreatedAt *gtime.Time `json:"createdAt" orm:"created_at" description:""` //
	UpdatedAt *gtime.Time `json:"updatedAt" orm:"updated_at" description:""` //
}
