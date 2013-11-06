#include <v8.h>
#include <node.h>

extern "C" {
    #include "mcp3008.h"

using namespace v8;

Handle<Value> Read(const Arguments& args) {
  HandleScope scope;
  int value = get_value();
  return scope.Close(Integer::New(value));
}

void Init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("reader"),
      FunctionTemplate::New(Read)->GetFunction());
}

NODE_MODULE(reader, Init)
}
