{
    "targets": [{
        "target_name": "findGitRepos",

        "dependencies": [
            "openpa/openpa.gyp:openpa"
        ],

        "sources": [
            "src/FindGitRepos.cpp",
            "src/Queue.cpp",
            "includes/FindGitRepos.h",
            "includes/Queue.h"
        ],
        "include_dirs": [
            "<!(node -e \"require('nan')\")",
            "includes"
        ],
        "conditions": [
            ["OS=='win'", {
                "msvs_settings": {
                    "VCCLCompilerTool": {
                        "DisableSpecificWarnings": [ "4506", "4538", "4793" ]
                    },
                    "VCLinkerTool": {
                        "AdditionalOptions": [ "/ignore:4248" ]
                    }
                },
                "defines": [
                    "OPA_HAVE_NT_INTRINSICS=1",
                    "_opa_inline=__inline"
                ],
                "conditions": [
                    ["target_arch=='x64'", {
                        "VCLibrarianTool": {
                          "AdditionalOptions": [
                            "/MACHINE:X64",
                          ],
                        },
                    }, {
                        "VCLibrarianTool": {
                          "AdditionalOptions": [
                            "/MACHINE:x86",
                          ],
                        },
                    }],
                ]
            }],
            ["OS=='mac' or OS=='linux'", {
                "defines": [
                    "OPA_HAVE_GCC_INTRINSIC_ATOMICS=1",
                    "HAVE_STDDEF_H=1",
                    "HAVE_STDLIB_H=1",
                    "HAVE_UNISTD_H=1"
                ]
            }],
            ["target_arch=='x64' or target_arch=='arm64'", {
                "defines": [
                    "OPA_SIZEOF_VOID_P=8"
                ]
            }],
            ["target_arch=='ia32' or target_arch=='armv7'", {
                "defines": [
                    "OPA_SIZEOF_VOID_P=4"
                ]
            }]
        ],
    }]
}
