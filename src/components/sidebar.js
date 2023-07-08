import styled from "styled-components"
import React from "react"
import { Link } from "gatsby"
import taxonomy from "../../config/taxonomy"
import { sanitizeUrl } from "@/plugins/edykim-plugin-taxonomy/utils"

const SideContainer = styled.aside`
  @media screen and (max-width: 999px) {
    display: none;
  }
  position: absolute;
  left: 0;
  top: 0;
  padding: 5.5rem 2rem;
  font-size: 0.8rem;
  ul {
    margin: 0.25rem 0 0.25rem 1rem;
    padding: 0;
    list-style: none;
  }
  margin-left: -1rem;
  margin-top: -0.25rem;

  .side-title {
    color: var(--color-subtitle);
    margin-top: 0.25rem;
    display: block;
  }
  a {
    color: var(--color-title);
    text-decoration: none;
  }
`

function Node({ node, isTag = false }) {
  const url = isTag ? sanitizeUrl(node.key, taxonomy) : node.url
  return (
    <li>
      {node.url ? (
        <Link
          key={`side-link-${url}`}
          to={isTag ? `/ko/tag/${url}/` : `/ko/${url}/`}
        >
          {`${node.key}`}
        </Link>
      ) : (
        <span className={"side-title"}>{node.key}</span>
      )}

      {node.children && (
        <ul>
          {node.children
            .filter(c => !c.hidden)
            .map(c => (
              <Node key={`node-${c.key}`} node={c} isTag={isTag} />
            ))}
        </ul>
      )}
    </li>
  )
}

export default function Sidebar() {
  return (
    <SideContainer>
      <ul>
        <Node
          node={{
            key: `블로그`,
            url: `post`,
          }}
        />
        <Node
          node={{
            key: `아카이브`,
            url: `archives`,
          }}
        />
        <Node
          node={{
            key: `소개`,
            url: `about`,
          }}
        />
        {taxonomy.tree.children.map(c => (
          <Node key={`side-link-${c.key}`} node={c} isTag={true} />
        ))}
      </ul>
    </SideContainer>
  )
}