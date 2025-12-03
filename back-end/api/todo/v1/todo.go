package v1

import (
	"back-end/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
)

// 每一个操作，都对应一组请求体，响应体，比方说这个

// 增加
type CreateReq struct {
	g.Meta `path:"/todo" method:"post" tags:"Todo" summary:"Create Todo"`
	Title  string `v:"required|length:1,10" dc:"todo title"`
}

type CreateRes struct {
	Id int64 `json:"id" dc:"todo id"`
}

// 删除
type DeleteReq struct {
	g.Meta `path:"/todo/{id}" method:"delete" tags:"Todo" summary:"Delete todo"`
	Id     int64 `v:"required" dc:"todo id"`
}
type DeleteRes struct{}

// 更新
type Status int

const (
	StatusFinish    Status = 0 // todo is OK.
	StatusNotFinish Status = 1 // todo is not Finish.
)

type UpdateReq struct {
	g.Meta `path:"/todo/{id}" method:"put" tags:"todo" summary:"Update todo"`
	Id     int64   `v:"required" dc:"todo id"`
	Title  *string `v:"length:1,10" dc:"todo title"`
	Done   *Status `v:"in:0,1" dc:"todo done"`
}
type UpdateRes struct{}

// 查询单个接口
type GetOneReq struct {
	g.Meta `path:"/todo/{id}" method:"get" tags:"todo" summary:"Get one todo"`
	Id     int64 `v:"required" dc:"todo id"`
}
type GetOneRes struct {
	*entity.Todo `dc:"todo"`
	// 这里的返回结果我们使用了*entity.User结构体，该结构是前面我们通过make dao命令生成的entity，该数据结构与数据表字段一一对应。
}

// 查询多个接口,加上了查询
type GetListReq struct {
	g.Meta `path:"/todo" method:"get" tags:"Todo" summary:"Get todo"`
	Title  *string `v:"length:1,10" dc:"todo title"`
	Done   *Status `v:"in:0,1" dc:"todo done"`
}
type GetListRes struct {
	List []*entity.Todo `json:"list" dc:"todo list"`
}
