---
title: "Vim Remote 기능 활용하기"
author: haruair
type: post
date: "2023-01-18T15:16:21.460Z"
lang: ko
tags:
  - 개발 이야기
  - vim
slug: "vim-remote"
---

간단하게 vim 메모 스크립트를 만들고 있었다. 스크립트가 실행될 때 이미 메모가 열려 있는 상태라면 메모를 닫으려고 했다. 기존 스크립트는 프로세스를 확인해서 프로세스가 있으면 닫았는데 닫기 전에 몇 가지 명령을 먼저 실행하고 싶었다. 외부에서 현재 실행되고 있는 vim 버퍼에 명령어를 전달할 수 있을까?

vim remote에 그 답이 있었다.

- [Vim documentation: remote](https://vimdoc.sourceforge.net/htmldoc/remote.html)
  - 참고: Vim에는 컴파일에 포함되어 있지 않은 경우가 있어서 확인이 필요하다.
- [Neovim: Remote](https://neovim.io/doc/user/remote.html)

vim을 실행할 때 먼저 `--listen`으로 pipe를 구독한다. 이 옵션을 추가하면 버퍼가 실행되는 동안에만 pipe 파일이 해당 경로에 생성된다.

```
$ nvim --listen ~/.cache/nvim/memo.pipe
```

그리고 해당 버퍼에 명령을 보내려면 `--server`로 해당 pip를 지정하고 `--remote-send`로 실행할 명령을 추가한다.

```
$ nvim --server ~/.cache/nvim/memo.pipe --remote-send 'ihello world<esc>:wqa<CR>'
```

원래 해결하려던 문제에 다음처럼 적용할 수 있다. 먼저 pipe 파일 존재 여부로 메모가 열려있는 상태를 확인한다. 열려있다면 저장하고 닫고 열려있지 않다면 실행한다.

```bash
if [[ -e ~/.cache/nvim/memo.pipe ]]; then
  nvim --server ~/.cache/nvim/memo.pipe --remote-send '<esc>:wqa<CR>'
else
  nvim --listen ~/.cache/nvim/memo.pipe -c Goyo -c startinsert &
fi
```

이런 스크립트는 터미널 자체에서 실행하면 큰 의미는 없지만 GUI 환경에서 단축키로 해당 스크립트를 활용하면 메모를 토글 버튼으로 열 수 있게 된다.

