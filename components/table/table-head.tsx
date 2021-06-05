import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { TableColumnItem } from './table-context'

interface Props {
  width: number
  columns: Array<TableColumnItem>
  className?: string
}

const defaultProps = {
  className: '',
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type TableHeadProps = Props & NativeAttrs

const makeColgroup = (width: number, columns: Array<TableColumnItem>) => {
  const unsetWidthCount = columns.filter(c => !c.width).length
  const customWidthTotal = columns.reduce((pre, current) => {
    return current.width ? pre + current.width : pre
  }, 0)
  const averageWidth = (width - customWidthTotal) / unsetWidthCount
  if (averageWidth <= 0) return <colgroup />
  return (
    <colgroup>
      {columns.map((column, index) => (
        <col key={`colgroup-${index}`} width={column.width || averageWidth} />
      ))}
    </colgroup>
  )
}

const TableHead: React.FC<TableHeadProps> = ({
  columns,
  width,
}: TableHeadProps & typeof defaultProps) => {
  const theme = useTheme()
  const isScalableWidth = useMemo(() => columns.find(item => !!item.width), [columns])
  const colgroup = useMemo(() => {
    if (!isScalableWidth) return <colgroup />
    return makeColgroup(width, columns)
  }, [isScalableWidth, width])

  return (
    <>
      {colgroup}
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={`table-th-${column.value}-${index}`}>
              <div className="thead-box">{column.label}</div>
            </th>
          ))}
        </tr>
      </thead>
      <style jsx>{`
        thead {
          border-collapse: separate;
          border-spacing: 0;
          font-size: inherit;
        }

        th {
          padding: 0 0.5em;
          font-size: calc(0.75 * var(--table-fontsize));
          font-weight: normal;
          text-align: left;
          letter-spacing: 0;
          vertical-align: middle;
          min-height: calc(2.5 * var(--table-fontsize));
          color: ${theme.palette.accents_5};
          background: ${theme.palette.accents_1};
          border-bottom: 1px solid ${theme.palette.border};
          border-top: 1px solid ${theme.palette.border};
          border-radius: 0;
        }

        th:nth-child(1) {
          border-bottom: 1px solid ${theme.palette.border};
          border-left: 1px solid ${theme.palette.border};
          border-top: 1px solid ${theme.palette.border};
          border-top-left-radius: ${theme.layout.radius};
          border-bottom-left-radius: ${theme.layout.radius};
        }

        th:last-child {
          border-bottom: 1px solid ${theme.palette.border};
          border-right: 1px solid ${theme.palette.border};
          border-top: 1px solid ${theme.palette.border};
          border-top-right-radius: ${theme.layout.radius};
          border-bottom-right-radius: ${theme.layout.radius};
        }

        .thead-box {
          display: flex;
          align-items: center;
          -webkit-box-align: center;
          min-height: calc(2.5 * var(--table-fontsize));
          text-transform: uppercase;
        }
      `}</style>
    </>
  )
}

TableHead.defaultProps = defaultProps
TableHead.displayName = 'GeistTableHead'
export default TableHead
