package todo

import (
	"context"

	v1 "back-end/api/todo/v1"
	"back-end/internal/dao"
)

func (c *ControllerV1) Delete(ctx context.Context, req *v1.DeleteReq) (res *v1.DeleteRes, err error) {
	_, err = dao.Todo.Ctx(ctx).WherePri(req.Id).Delete()
	return
}
